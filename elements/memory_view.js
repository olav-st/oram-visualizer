import MemoryElement from './memory';

export default class MemoryViewElement extends MemoryElement
{
    constructor(elementID, memory, start, length) 
    {
        super(elementID, memory.buffer.slice(start, start + length));
        this.memory = memory;
    }

    read(addr)
    {
        this.memory.read(addr);
        return super.read(addr);
    }

    write(addr, data)
    {
        this.memory.write(addr, data);
        super.write(addr, data);
    }
}