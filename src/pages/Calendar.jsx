import React, { useState, useEffect } from "react";
import { generateCalendar } from "../utils/calendar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Calendar = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({ name: "", startTime: "", endTime: "", description: "" });
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });


  // this will fetch events when component is mounted
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events"));
    if (storedEvents) {
      setEvents(storedEvents);
    }
  }, []);

  // this will save events 
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const days = generateCalendar(currentYear, currentMonth);

  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.startTime || !newEvent.endTime) return;

    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      const dayEvents = updatedEvents[selectedDay] || [];
      updatedEvents[selectedDay] = [...dayEvents, { ...newEvent }];
      return updatedEvents;
    });

    setNewEvent({ name: "", startTime: "", endTime: "", description: "" });
  };

  const handleEditEvent = (eventIndex) => {
    const eventToEdit = events[selectedDay][eventIndex];
    setNewEvent({ ...eventToEdit, eventIndex });
  };

  const handleUpdateEvent = () => {
    const updatedEventList = events[selectedDay].map((event, index) =>
      index === newEvent.eventIndex ? { ...newEvent } : event
    );

    setEvents((prevEvents) => ({
      ...prevEvents,
      [selectedDay]: updatedEventList,
    }));

    setNewEvent({ name: "", startTime: "", endTime: "", description: "" });
  };

  const handleDeleteEvent = (eventIndex) => {
    const updatedEventList = events[selectedDay].filter((_, index) => index !== eventIndex);
    setEvents((prevEvents) => ({
      ...prevEvents,
      [selectedDay]: updatedEventList,
    }));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="calendar">

      <div className="header">
        <button onClick={handlePrevMonth}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 ease-in-out"
        >Previous</button>
        <h2 className="font-bold">
          {monthName} {currentYear}
        </h2>
        <button onClick={handleNextMonth}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 ease-in-out"
        >Next</button>
      </div>

      <div className="grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="grid-header">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div
                className={`${ day === today.getDate() ? "current-day" : ""} grid-cell ${day ? "" : "empty"}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </div>
            </DialogTrigger>
            {day && (
              <DialogContent className="block">
                
                <div>
                  <h1>Events for {day} {today.toLocaleString("default", { month: "long" })}</h1>
                  {/*I have displayed the events here */}
                  {events[day] && events[day].length > 0 ? (
                    events[day].map((event, index) => (
                      <div key={index} className="flex items-center justify-between space-x-4 p-2 bg-gray-100 rounded-md shadow-sm">
                        <div className="flex-1">
                          <strong>{event.name}</strong>
                          <span className="mx-2">|</span>
                          {event.startTime} - {event.endTime}
                          {event.description && (
                            <span className="text-sm text-gray-600 ml-2">({event.description})</span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEvent(index)}
                            className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(index)}
                            className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                    ))
                  ) : (
                    <p>No events for this day.</p>
                  )}
                </div>

                {/* This is the form to add/update events */}
                <div className="event-form mt-8">
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  />
                  <div className="flex items-center justify-between">
                    <label htmlFor=""> Start Time :</label>
                  <input
                    type="time"
                    placeholder="startTime"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  />
                  <label htmlFor=""> End Time :</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  ></textarea>
                  <DialogFooter>
                    <button onClick={newEvent.eventIndex !== undefined ? handleUpdateEvent : handleAddEvent} className="rounded">
                      {newEvent.eventIndex !== undefined ? "Update Event" : "Add Event"}
                    </button>
                  </DialogFooter>
                </div>
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
