export default`const NUMBERS = [1, 3, 5, 7, 9];

async function runTest()
{
    let retrieved = [];
    for(let i = 0; i < NUMBERS.length; i++)
    {
        await write(i, NUMBERS[i]);
    }
    for(let i = 0; i < NUMBERS.length; i++)
    {
        retrieved.push(await read(i));
    }
    return "added " + NUMBERS + " retrieved " + retrieved;
}`;