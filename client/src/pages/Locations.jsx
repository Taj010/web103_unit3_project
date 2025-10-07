import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LocationsAPI from '../services/LocationsAPI'
import '../css/Locations.css'

const Locations = () => {

    const [locations, setLocations] = useState([])

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

    useEffect(() => {
        (async () => {
            try {
                const locationsData = await LocationsAPI.getAllLocations()
                setLocations(locationsData)
            }
            catch (error) {
                console.error(error)
            }
        }) ()
    }, [])

    return (
        <div className='locations-page'>
            <header className='locations-header'>
                <h2>Drama Destinations</h2>
                <p>Explore K-Drama inspired locations. Click a destination to view amazing events in the locaiton.</p>
                <div className='locations-actions'>
                    <Link to='/events' className='btn-primary'>View All Events</Link>
                </div>
            </header>
            <div className='locations-grid'>
                {locations.map(loc => (
                    <Link className='location-card' to={`/locations/${loc.id}`} key={loc.id}>
                        <div className='location-media'>
                            { (getLocationImage(loc.name, loc.image))
                                ? <img src={getLocationImage(loc.name, loc.image)} alt={loc.name} />
                                : <div className='location-placeholder' /> }
                        </div>
                        <div className='location-body'>
                            <h3>{loc.name}</h3>
                            <p className='location-desc'>{getLocationDescription(loc.name)}</p>
                            <p className='location-address'>{loc.address}, {loc.city}</p>
                            <p className='location-hours'>{getLocationHours()}</p>
                            <span className='location-link'>View events in location »</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Locations