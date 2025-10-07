import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Event from '../components/Event'
import EventsAPI from '../services/EventsAPI'
import LocationsAPI from '../services/LocationsAPI'
import '../css/LocationEvents.css'

const getLocationImage = (name, fallback) => {
    const map = {
        'Han River Hideaway': '/hanriver.jpg',
        'Drama High School': '/highschool.jpg',
        'Spirit Realm Shrine': '/shrine.jpg',
        'The Neighborhood Café': '/cafe.jpg',
        'Seoul Nights Rooftop': '/rooftop.jpg'
    }
    return map[name] || fallback || ''
}

const getLocationDescription = (name) => {
    const map = {
        'Han River Hideaway': 'Peaceful riverside park for cozy meetups and reflections.',
        'Drama High School': 'Nostalgic campus vibes full of talent and stories.',
        'Spirit Realm Shrine': 'Mystical grounds inspired by fantasy dramas.',
        'The Neighborhood Café': 'Cozy hub for crafts, music, and warm chats.',
        'Seoul Nights Rooftop': 'City lights and late-night moments under the stars.'
    }
    return map[name] || 'A delightful destination in the DramaVerse.'
}

const getLocationHours = () => 'Open daily • 10:00 AM – 10:00 PM'

const LocationEvents = () => {
    const { id } = useParams()
    const [location, setLocation] = useState({})
    const [events, setEvents] = useState([])

    useEffect(() => {
        (async () => {
            try {
                console.log('Fetching location with id:', id)
                const locations = await LocationsAPI.getAllLocations()
                console.log('All locations:', locations)
                const selected = locations.find(l => String(l.id) === String(id))
                console.log('Selected location:', selected)
                if (!selected) {
                    setLocation({})
                    setEvents([])
                    return
                }
                setLocation(selected)
                const evts = await EventsAPI.getEventsByLocationId(selected.id)
                console.log('Events for location:', evts)
                setEvents(evts)
            } catch (err) {
                console.error('Error in LocationEvents:', err)
            }
        })()
    }, [id])

    return (
        <div className='location-events'>
            <div className='location-events-topbar'>
                <h2 className='page-title'>{location.name}</h2>
                <Link to='/' className='btn-home'>Back to Destinations</Link>
            </div>

            <div className='location-details-card'>
                <div className='location-media'>
                    {getLocationImage(location.name, location.image) ? 
                        <img src={getLocationImage(location.name, location.image)} alt={location.name} /> : 
                        <div className='location-placeholder' />
                    }
                </div>
                <div className='location-body'>
                    <h3>{location.name}</h3>
                    <p className='location-desc'>{getLocationDescription(location.name)}</p>
                    <p className='location-address'>{location.address}, {location.city}, {location.state} {location.zip}</p>
                    <p className='location-hours'>{getLocationHours()}</p>
                    <div className='location-extra-info'>
                        <p><strong>Capacity:</strong> 50-100 people</p>
                        <p><strong>Features:</strong> WiFi, Parking, Accessibility</p>
                        <p><strong>Contact:</strong> info@dramaverse.com</p>
                    </div>
                </div>
            </div>

            <div className='location-events-section'>
                <h3>Events at {location.name}</h3>
                {
                    events && events.length > 0 ? (
                        <div className='events-grid'>
                            {events.map((event, index) => {
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

                                const isPast = isEventPast(event.date, event.time)
                                const timeRemaining = getTimeRemaining(event.date, event.time)

                                return (
                                    <article className={`event-card ${isPast ? 'event-past' : ''}`} key={event.id}>
                                        <div className='event-media'>
                                            {event.image ? <img src={event.image} alt={event.title} /> : <div className='event-placeholder' />}
                                            {isPast && <div className='event-past-overlay'>PAST EVENT</div>}
                                        </div>
                                        <div className='event-body'>
                                            <h3 className='event-title'>{event.title}</h3>
                                            <p className='event-meta'>
                                                <span className='event-date'>{new Date(event.date).toLocaleDateString()}</span>
                                                <span className='event-sep'>•</span>
                                                <span className='event-time'>{event.time}</span>
                                            </p>
                                            <p className='event-location'>{location.name}</p>
                                            <p className='event-status'>{timeRemaining}</p>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    ) : (
                        <p className='no-events'>No events scheduled at this location yet!</p>
                    )
                }
            </div>
        </div>
    )
}

export default LocationEvents