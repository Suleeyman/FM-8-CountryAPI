async function getUniqueCountry(name) {
    console.log('test');
    // https://restcountries.com/v2/name/{name}
    // https://restcountries.com/v3.1/name/${name}
    const resp = await fetch(`https://restcountries.com/v3.1/name/${name}`)
    const data = await resp.json()
    return data;
}

export { getUniqueCountry }