async function getUniqueCountry(name) {
    // https://restcountries.com/v2/name/{name}
    // https://restcountries.com/v3.1/name/${name}
    try {
        const resp = await fetch(`https://restcountries.com/v3.1/name/${name}`)
        const data = await resp.json()
        return data;
    } catch(err) {
        console.log(err)
        return undefined;
    }
}

export { getUniqueCountry }