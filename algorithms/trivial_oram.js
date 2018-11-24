export default`function read(addr)
{
    let targetData = null;
    for(let i = 0; i < memory.length; i++)
    {
        let tmp = memory.read(i);
        memory.write(i, tmp);
        if(i == addr)
        {
            targetData = tmp;
        }
    }
    return targetData;
}

function write(addr, data)
{
    for(let i = 0; i < memory.length; i++)
    {
        let tmp = memory.read(i);
        if(i != addr)
        {
            memory.write(i, tmp);
        }else
        {
            memory.write(i, data);
        }
    }
}`;