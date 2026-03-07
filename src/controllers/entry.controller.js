import Timeline from "../models/Timeline.js";
import Entry from "../models/Entry.js";



export const getEntries = async (req, res) => {
  try {
    const { timelineId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const entries = await Entry.find({ timeline: timelineId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Entry.countDocuments({ timeline: timelineId });

    res.json({
      success: true,
      data: entries,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================
   2️⃣ ADD ENTRY + UPDATE POINTS
========================================= */

export const addEntry = async (req, res) => {
  try {
    const { timelineId } = req.params;
    const { content, imageUrl } = req.body;

    const entry = await Entry.create({
      timeline: timelineId,
      owner: req.user._id,
      content,
      imageUrl,
    });

    // Unique days count for points
    const uniqueDays = await Entry.aggregate([
      { $match: { timeline: entry.timeline } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
        },
      },
      { $count: "totalDays" },
    ]);

    const totalDays = uniqueDays[0]?.totalDays || 0;

    const timeline = await Timeline.findById(timelineId);

    timeline.points = totalDays;

    // Level system
    if (totalDays >= 300) timeline.level = "Platinum";
    else if (totalDays >= 200) timeline.level = "Gold";
    else if (totalDays >= 100) timeline.level = "Silver";
    else timeline.level = "Bronze";

    await timeline.save();

    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================
   3️⃣ MONTHLY LEADERBOARD
========================================= */

export const getMonthlyLeaderboard = async (req, res) => {
  try {
    const { monthYear } = req.params;

    const leaderboard = await Timeline.find({
      monthYear,
      status: "active",
    })
      .sort({ points: -1 })
      .limit(10)
      .populate("owners", "name");

    res.json({ success: true, data: leaderboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================================
   4️⃣ ADD PARTNER (COUPLE FEATURE)
========================================= */

export const addPartner = async (req, res) => {
  try {
    const { timelineId, partnerId } = req.body;

    const timeline = await Timeline.findById(timelineId);

    if (!timeline) {
      return res.status(404).json({ error: "Timeline not found" });
    }

    if (!timeline.owners.includes(partnerId)) {
      timeline.owners.push(partnerId);
      await timeline.save();
    }

    res.json({ success: true, message: "Partner added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};