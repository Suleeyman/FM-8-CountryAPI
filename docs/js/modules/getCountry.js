async function getUniqueCountry(nameInput) {
    const resp = await fetch(`https://restcountries.eu/rest/v2/name/${nameInput}`)
    const data = await resp.json()
    return data;
}

export { getUniqueCountry }