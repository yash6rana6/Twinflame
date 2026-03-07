import Timeline from "../models/Timeline.js";
import TimelineEvent from "../models/TimelineEvent.js";
import { nanoid } from "nanoid";

/* ----------------------------------------
   Utility: Calculate Level
-----------------------------------------*/
const calculateLevel = (points) => {
  if (points >= 1000) return "Platinum";
  if (points >= 500) return "Gold";
  if (points >= 200) return "Silver";
  return "Bronze";
};

/* ----------------------------------------
   1️⃣ Create Timeline
-----------------------------------------*/
export const createTimeline = async (req, res) => {
  try {
    const { title, description, theme, partnerId } = req.body;

    if (!partnerId)
      return res.status(400).json({ message: "Partner required" });

    const timeline = await Timeline.create({
      shareId: nanoid(10),
      owners: [req.user._id, partnerId],
      title,
      description,
      theme,
      monthYear: new Date().toISOString().slice(0, 7),
      status: "active",
    });

    res.status(201).json({
      success: true,
      timeline,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   2️⃣ Get Timeline by ShareId
-----------------------------------------*/
export const getTimeline = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const timeline = await Timeline.findOne({ shareId })
      .populate("owners", "name email");

    if (!timeline)
      return res.status(404).json({ message: "Timeline not found" });

    // auto expire check
    if (timeline.expiresAt < new Date()) {
      timeline.status = "expired";
      await timeline.save();
    }

    // increase view count (only if not owner)
    if (
      !req.user ||
      !timeline.owners.some(
        (owner) => owner._id.toString() === req.user?._id?.toString()
      )
    ) {
      timeline.viewCount += 1;
      await timeline.save();
    }

    const events = await TimelineEvent.find({
      timeline: timeline._id,
    })
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalEvents = await TimelineEvent.countDocuments({
      timeline: timeline._id,
    });

    res.json({
      success: true,
      timeline,
      events,
      pagination: {
        total: totalEvents,
        page: Number(page),
        pages: Math.ceil(totalEvents / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   3️⃣ Update Timeline
-----------------------------------------*/
export const updateTimeline = async (req, res) => {
  try {
    const { timelineId } = req.params;

    const timeline = await Timeline.findById(timelineId);

    if (!timeline)
      return res.status(404).json({ message: "Timeline not found" });

    // ownership check
    if (!timeline.owners.includes(req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    const updates = ["title", "description", "theme"];

    updates.forEach((field) => {
      if (req.body[field]) timeline[field] = req.body[field];
    });

    await timeline.save();

    res.json({
      success: true,
      timeline,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   4️⃣ Delete Timeline
-----------------------------------------*/
export const deleteTimeline = async (req, res) => {
  try {
    const { timelineId } = req.params;

    const timeline = await Timeline.findById(timelineId);

    if (!timeline)
      return res.status(404).json({ message: "Timeline not found" });

    if (!timeline.owners.includes(req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    await TimelineEvent.deleteMany({ timeline: timeline._id });
    await timeline.deleteOne();

    res.json({
      success: true,
      message: "Timeline deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   5️⃣ Manually Activate Timeline
-----------------------------------------*/
export const activateTimeline = async (req, res) => {
  try {
    const { timelineId } = req.params;

    const timeline = await Timeline.findById(timelineId);

    if (!timeline)
      return res.status(404).json({ message: "Timeline not found" });

    timeline.status = "active";
    timeline.expiresAt = new Date(
      Date.now() + timeline.validityDays * 24 * 60 * 60 * 1000
    );

    await timeline.save();

    res.json({
      success: true,
      timeline,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   6️⃣ Recalculate Level (Gamification)
-----------------------------------------*/
export const recalculateLevel = async (timelineId) => {
  const timeline = await Timeline.findById(timelineId);

  if (!timeline) return;

  timeline.level = calculateLevel(timeline.points);

  if (timeline.currentStreak > timeline.longestStreak) {
    timeline.longestStreak = timeline.currentStreak;
  }

  await timeline.save();
};