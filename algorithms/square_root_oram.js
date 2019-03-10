export default`function read(addr)
{
    let targetData = null;
    for(let i = 0; i < permuted.length; i++)
    {
        let tmp = permuted.read(i);
        permuted.write(i, tmp);
        if(i == addr)
        {
            targetData = tmp;
        }
    }
    return targetData;
}

function write(addr, data)
{
    for(let i = 0; i < permuted.length; i++)
    {
        let tmp = permuted.read(i);
        if(i != addr)
        {
            permuted.write(i, tmp);
        }else
        {
            permuted.write(i, data);
        }
    }
}`;