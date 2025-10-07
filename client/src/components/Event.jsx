import React from 'react'
import '../css/Event.css'

const Event = ({ id, title, date, time, image }) => {
    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString()
        } catch {
            return iso
        }
    }

    return (
        <article className='event-information'>
            <img src={image || '/placeholder-event.jpg'} alt={title} />

            <div className='event-information-overlay'>
                <div className='text'>
                    <h3>{title}</h3>
                    <p><i className="fa-regular fa-calendar fa-bounce"></i> {formatDate(date)} <br /> {time}</p>
                </div>
            </div>
        </article>
    )
}

export default Event