export default`const NUMBERS_TO_SORT = [7, 9, 4, 7, 9, 2, 0, 1, 2, 9, 1, 3, 0, 2, 3, 1];

async function fillMemory(memory, arr)
{
    for(let i = 0; i < Math.min(memory.length, arr.length); i++)
    {
        write(i, arr[i]);
    }
}

async function bubbleSort(memory, n)
{
    let sorted = false;
    while(!sorted)
    {
        sorted = true;
        for(let i = 1; i < n; i++)
        {
            let left = await read(i - 1);
            let right = await read(i);
            if(left > right)
            {
                await write(i - 1, right);
                await write(i, left);
                sorted = false;
            }
        }
    }
}

async function runTest()
{
    await fillMemory(memory, NUMBERS_TO_SORT);
    memory.resetStatistics();
    await bubbleSort(memory, NUMBERS_TO_SORT.length);

    let sorted = [];
    for(let i = 0; i < NUMBERS_TO_SORT.length; i++)
    {
        let val = await read(i);
        sorted.push(val);
    }
    return sorted;
}`;