const BASE_URL = '/api/locations'

const LocationsAPI = {
  async getAllLocations() {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch locations')
    return res.json()
  }
}

export default LocationsAPI


