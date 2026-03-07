import TimelineEvent from "../models/TimelineEvent.js";
import Timeline from "../models/Timeline.js";

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
   Utility: Check Ownership
-----------------------------------------*/
const checkOwnership = (timeline, userId) => {
  return timeline.owners.some(
    (owner) => owner.toString() === userId.toString()
  );
};

/* ----------------------------------------
   1️⃣ Add Event
-----------------------------------------*/
export const addEvent = async (req, res) => {
  try {
    const { timelineId } = req.params;
    const { date, title, description, mood, media } = req.body;

    if (!date)
      return res.status(400).json({ message: "Date is required" });

    const timeline = await Timeline.findById(timelineId);

    if (!timeline)
      return res.status(404).json({ message: "Timeline not found" });

    if (!checkOwnership(timeline, req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    if (timeline.status === "expired")
      return res.status(400).json({ message: "Timeline expired" });

    // prevent duplicate date event
    const existingEvent = await TimelineEvent.findOne({
      timeline: timelineId,
      dateString: date,
    });

    if (existingEvent)
      return res
        .status(400)
        .json({ message: "Event already exists for this date" });

    const event = await TimelineEvent.create({
      timeline: timelineId,
      date,
      dateString: date,
      title,
      description,
      mood,
      media,
    });

    /* ----------- STREAK LOGIC ----------- */
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (timeline.lastEventDate === yesterdayStr) {
      timeline.currentStreak += 1;
    } else {
      timeline.currentStreak = 1;
    }

    timeline.lastEventDate = date;
    timeline.points += 10;

    if (timeline.currentStreak > timeline.longestStreak) {
      timeline.longestStreak = timeline.currentStreak;
    }

    timeline.level = calculateLevel(timeline.points);

    await timeline.save();

    res.status(201).json({
      success: true,
      event,
      streak: timeline.currentStreak,
      level: timeline.level,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   2️⃣ Get Single Event
-----------------------------------------*/
export const getSingleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await TimelineEvent.findById(eventId)
      .populate("timeline", "title shareId")
      .populate("media.uploadedBy", "name");

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    res.json({
      success: true,
      event,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   3️⃣ Update Event
-----------------------------------------*/
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await TimelineEvent.findById(eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const timeline = await Timeline.findById(event.timeline);

    if (!checkOwnership(timeline, req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    const updatableFields = ["title", "description", "mood", "media"];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    res.json({
      success: true,
      event,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   4️⃣ Delete Event
-----------------------------------------*/
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await TimelineEvent.findById(eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const timeline = await Timeline.findById(event.timeline);

    if (!checkOwnership(timeline, req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    await event.deleteOne();

    /* ----------- Adjust Points ----------- */
    timeline.points = Math.max(0, timeline.points - 10);

    timeline.level = calculateLevel(timeline.points);

    await timeline.save();

    res.json({
      success: true,
      message: "Event deleted",
      updatedPoints: timeline.points,
      level: timeline.level,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ----------------------------------------
   5️⃣ Get Events by Month
-----------------------------------------*/
export const getEventsByMonth = async (req, res) => {
  try {
    const { timelineId } = req.params;
    const { monthYear } = req.query; // "2026-03"

    if (!monthYear)
      return res.status(400).json({ message: "MonthYear required" });

    const events = await TimelineEvent.find({
      timeline: timelineId,
      dateString: { $regex: `^${monthYear}` },
    }).sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};