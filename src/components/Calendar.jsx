import { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Link } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      title: "Team Meeting",
      start: new Date(2024, 10, 29, 10, 0),
      end: new Date(2024, 10, 29, 11, 30),
    },
    {
      title: "Project Deadline",
      start: new Date(2024, 10, 30, 15, 0),
      end: new Date(2024, 10, 30, 17, 0),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });

  const handleAddEvent = () => {
    const { title, start, end } = newEvent;

    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }
    if (!start || !end) {
      alert("Please provide both start and end times.");
      return;
    }
    if (moment(start).isAfter(moment(end))) {
      alert("End time must be after start time.");
      return;
    }

    setEvents((prevEvents) => [
      ...prevEvents,
      { title, start: new Date(start), end: new Date(end) },
    ]);

    setShowModal(false);
    setNewEvent({ title: "", start: "", end: "" });
  };

  const EventComponent = ({ event }) => (
    <div className="event-item">
      <span>{event.title}</span>
    </div>
  );

  const CustomToolbar = ({ label, onNavigate }) => (
    <div className="custom-toolbar">
      <button onClick={() => onNavigate("PREV")}>&lt;</button>
      <span className="toolbar-label">{label}</span>
      <button onClick={() => onNavigate("NEXT")}>&gt;</button>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Interactive Calendar</h2>
      <Link to="/menu" className="block text-blue-500 hover:underline">
         Back to Menu
         </Link>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>
      <div style={{ height: "600px" }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "600px", borderRadius: "8px", overflow: "hidden" }}
          components={{
            event: EventComponent,
            toolbar: CustomToolbar,
          }}
          popup
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Add New Task</h3>
            <label className="block mb-2">Task Title</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              placeholder="Task title"
            />
            <label className="block mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={newEvent.start}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2">End Time</label>
            <input
              type="datetime-local"
              value={newEvent.end}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
