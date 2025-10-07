const BASE_URL = '/api/events'

const EventsAPI = {
  async getAllEvents() {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch events')
    return res.json()
  },

  async getEventsByLocationId(locationId) {
    const res = await fetch(`${BASE_URL}/location/${locationId}`)
    if (!res.ok) throw new Error('Failed to fetch events by location')
    return res.json()
  }
}

export default EventsAPI


