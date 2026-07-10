import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005/api/cds"

/** @returns {Promise<CD[]>} */
export const getCDs = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

/** @returns {Promise<CD>} */
export const addCD = async (/** @type {NewCD} */ cd) => {
  const response = await axios.post(API_URL, cd)
  return response.data
}

export const deleteCD = async (/** @type {number} */ id) => {
  await axios.delete(`${API_URL}/${id}`)
}
