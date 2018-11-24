import MemoryElement from './memory';

export default class BucketElement extends MemoryElement
{
    constructor(elementID, memory, startAddr, length) 
    {
        super(elementID, memory.buffer, true);
        this.memory = memory;
        this.startAddr = startAddr;
        this.length = length;
        this.element.onmouseover = this.onMouseOver.bind(this);
        this.element.onmouseout = this.onMouseOut.bind(this);
    }

    read(addr)
    {
        this._animateAccess(addr, "read");
        this.numReads++;
        return this.memory.read(this.startAddr + addr);
    }

    write(addr, data)
    {
        this._animateAccess(addr, "written");
        this.numWrites++;
        this._set(addr, data);
        this.memory.write(this.startAddr + addr, data);
    }

    peekBlock(tag)
    {
        let data = null;
        for(let i = 0; i < this.length; i += 2)
        {
            let tmpData = this.read(i);
            let tmpTag = this.read(i + 1);
            if(tmpTag == tag || (tag === undefined && tmpTag !== null))
            {
                data = tmpData;
                tag = tmpTag;
            }
            this.write(i, tmpData);
            this.write(i + 1, tmpTag);
        }
        if(data != null)
        {
            return [tag, data]
        }
        return [null, null]
    }

    popBlock(tag)
    {
        let data = null;
        for(let i = 0; i < this.length; i += 2)
        {
            let tmpData = this.read(i);
            let tmpTag = this.read(i + 1);
            if(tmpTag !== null && (tmpTag == tag || tag === undefined))
            {
                data = tmpData;
                tag = tmpTag;
                this.write(i, null);
                this.write(i + 1, null);
            }else
            {
                this.write(i, tmpData);
                this.write(i + 1, tmpTag);
            }
        }
        
        if(data != null)
        {
            return [tag, data]
        }

        return [null, null]
    }

    pushBlock(tag, data)
    {
        let written = false;
        for(let i = 0; i < this.length; i += 2)
        {
            let tmpData = this.read(i);
            let tmpTag = this.read(i + 1);
            if(tmpTag === null && !written)
            {
                this.write(i, data);
                this.write(i + 1, tag);
                written = true;
            }
            else
            {
                this.write(i, tmpData);
                this.write(i + 1, tmpTag);
            }
        }
        return written;
    }

    onMouseOver()
    {
        this.setRangeHighlighted(0, this.length, true);
        this.memory.setRangeHighlighted(this.startAddr, this.startAddr + this.length, true);
    }

    onMouseOut()
    {
        this.setRangeHighlighted(0, this.length, false);
        this.memory.setRangeHighlighted(this.startAddr, this.startAddr + this.length, false);
    }

    get size()
    {
        return this.length;
    }

    set size(newSize)
    {
        this.length = newSize;
    }
}