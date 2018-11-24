export default`const NUMBERS_TO_SUM = [7, 3, 4, 7, 1, 5, 9, 2];

async function fillMemory(memory, arr)
{
    for(let i = 0; i < Math.min(memory.length, arr.length); i++)
    {
        write(i, arr[i]);
    }
}

async function sum(memory, n)
{
    let sum = 0;
    for(let i = 1; i < n; i++)
    {
        let left = await read(i - 1);
        let right = await read(i);
        sum = left + right;
        write(i, sum);
    }
    return sum;
}

async function runTest()
{
    await fillMemory(memory, NUMBERS_TO_SUM);
    memory.resetStatistics();
    return await sum(memory, NUMBERS_TO_SUM.length);
}`;