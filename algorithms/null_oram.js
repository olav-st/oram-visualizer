export default `function read(addr)
{
    return memory.read(addr);
}

function write(addr, data)
{
    memory.write(addr, data);
}`;