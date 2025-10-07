import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EventsAPI from '../services/EventsAPI'
import '../css/Events.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const data = await EventsAPI.getAllEvents()
        setEvents(data)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString()
    } catch {
      return iso
    }
  }

  const isEventPast = (date, time) => {
    try {
      // Handle different time formats
      let eventDateTime
      if (time === 'All Day') {
        eventDateTime = new Date(date)
      } else {
        // Convert time to 24-hour format for proper parsing
        let time24 = time
        if (time.includes('PM') && !time.includes('12:')) {
          const hour = parseInt(time.split(':')[0])
          time24 = time.replace(`${hour}:`, `${hour + 12}:`).replace(' PM', '')
        } else if (time.includes('AM') && time.includes('12:')) {
          time24 = time.replace('12:', '00:').replace(' AM', '')
        } else {
          time24 = time.replace(/ (AM|PM)/, '')
        }
        
        eventDateTime = new Date(`${date}T${time24}:00`)
      }
      
      return eventDateTime < new Date()
    } catch {
      return false
    }
  }

  const getTimeRemaining = (date, time) => {
    try {
      // Handle different time formats
      let eventDateTime
      if (time === 'All Day') {
        eventDateTime = new Date(date)
      } else {
        // Convert time to 24-hour format for proper parsing
        let time24 = time
        if (time.includes('PM') && !time.includes('12:')) {
          const hour = parseInt(time.split(':')[0])
          time24 = time.replace(`${hour}:`, `${hour + 12}:`).replace(' PM', '')
        } else if (time.includes('AM') && time.includes('12:')) {
          time24 = time.replace('12:', '00:').replace(' AM', '')
        } else {
          time24 = time.replace(/ (AM|PM)/, '')
        }
        
        eventDateTime = new Date(`${date}T${time24}:00`)
      }
      
      const now = new Date()
      const diffMs = eventDateTime - now
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      
      if (isNaN(diffDays)) {
        return 'Date error'
      }
      
      if (diffDays < 0) {
        return `Ended ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`
      } else if (diffDays === 0) {
        return 'Today'
      } else if (diffDays === 1) {
        return 'Tomorrow'
      } else {
        return `In ${diffDays} days`
      }
    } catch (error) {
      console.error('Date parsing error:', error)
      return 'Date error'
    }
  }

  const locations = useMemo(() => {
    const set = new Set(events.map(e => e.location_name))
    return Array.from(set)
  }, [events])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events.filter(e => {
      const matchesQuery = q === '' || e.title.toLowerCase().includes(q)
      const matchesLoc = locationFilter === '' || e.location_name === locationFilter
      return matchesQuery && matchesLoc
    })
  }, [events, query, locationFilter])

  return (
    <div className='events-page'>
      <div className='events-topbar'>
        <h2 className='page-title'>Events</h2>
        <Link to='/' className='btn-home'>Home</Link>
      </div>

      <div className='events-controls'>
        <input
          className='events-search'
          type='text'
          placeholder='Search by title or keyword'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          className='events-filter'
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        >
          <option value=''>All locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      {
        filtered && filtered.length > 0 ? (
          <div className='events-grid'>
            {filtered.map(ev => {
              const isPast = isEventPast(ev.date, ev.time)
              const timeRemaining = getTimeRemaining(ev.date, ev.time)
              
              // Debug logging
              console.log('Event:', ev.title, 'Date:', ev.date, 'Time:', ev.time, 'IsPast:', isPast, 'TimeRemaining:', timeRemaining)
              
              return (
                <article className={`event-card ${isPast ? 'event-past' : ''}`} key={ev.id}>
                  <div className='event-media'>
                    {ev.image ? <img src={ev.image} alt={ev.title} /> : <div className='event-placeholder' />}
                    {isPast && <div className='event-past-overlay'>PAST EVENT</div>}
                  </div>
                  <div className='event-body'>
                    <h3 className='event-title'>{ev.title}</h3>
                    <p className='event-meta'>
                      <span className='event-date'>{formatDate(ev.date)}</span>
                      <span className='event-sep'>•</span>
                      <span className='event-time'>{ev.time}</span>
                    </p>
                    <p className='event-location'>{ev.location_name}</p>
                    <p className='event-status'>{timeRemaining}</p>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p>No events match your filters.</p>
        )
      }
    </div>
  )
}

export default Events


