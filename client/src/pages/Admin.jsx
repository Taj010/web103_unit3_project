import React, { useEffect, useState } from 'react'
import LocationsAPI from '../services/LocationsAPI'
import EventsAPI from '../services/EventsAPI'
import '../css/Admin.css'

const Admin = () => {
  const [locations, setLocations] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [locationsData, eventsData] = await Promise.all([
          LocationsAPI.getAllLocations(),
          EventsAPI.getAllEvents()
        ])
        setLocations(locationsData)
        setEvents(eventsData)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <div className='admin-page'>Loading database contents...</div>
  }

  return (
    <div className='admin-page'>
      <h1>Database Contents</h1>
      <p>This page shows all data from the database tables.</p>

      <section className='table-section'>
        <h2>Locations Table</h2>
        <table className='data-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(loc => (
              <tr key={loc.id}>
                <td>{loc.id}</td>
                <td>{loc.name}</td>
                <td>{loc.address}</td>
                <td>{loc.city}</td>
                <td>{loc.state}</td>
                <td>{loc.zip}</td>
                <td>
                  <a href={loc.image} target='_blank' rel='noopener noreferrer'>
                    View Image
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className='table-section'>
        <h2>Events Table</h2>
        <table className='data-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Location ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Time</th>
              <th>Location Name</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{event.location_id}</td>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.time}</td>
                <td>{event.location_name}</td>
                <td>
                  <a href={event.image} target='_blank' rel='noopener noreferrer'>
                    View Image
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Admin
