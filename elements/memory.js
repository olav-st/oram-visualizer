const MAX_CELLS_SHOWN = 150;

export default class MemoryElement
{
    constructor(elementID, buffer, showTags) 
    {
        this.buffer = buffer.fill(null);
        this.tags = showTags;
        this.element = document.getElementById(elementID);
        //Animation stuff
        this.animationSpeed = 0.5;
        //Statistics
        this.numReads = 0;
        this.numWrites = 0;
        //Setup the table to visualize
        this._initTable();
    }

    read(addr)
    {
        this._animateAccess(addr, "read");
        this.numReads++;
        return this._get(addr);
    }

    write(addr, data)
    {
        this._animateAccess(addr, "written");
        this.numWrites++;
    	this._set(addr, data);
    }

    clear()
    {
        for(let i = 0; i < this.length; i++)
        {
            this._set(i, null);
        }
    }

    resetStatistics()
    {
        this.numReads = 0;
        this.numWrites = 0;
    }

    setRangeHighlighted(start, end, highlighted)
    {
        for(let i = start; i < end; i++)
        {
            let dataCell = this.element.childNodes[i];
            if(dataCell != null)
            {
                if(highlighted)
                {
                    dataCell.classList.add("highlighted");
                }
                else
                {
                    dataCell.classList.remove("highlighted");
                }
            }
        }
    }

    _get(addr)
    {
        return this.buffer[addr];
    }

    _set(addr, data)
    {
        this.buffer[addr] = data;
        if(addr < this.element.childNodes.length)
        {
            let dataCell = this.element.childNodes[addr];
            if(data === null || data === undefined)
            {
                data = "-";
            }
            dataCell.innerHTML = "" + data;
        }
    }

    _initTable()
    {
        this.element.innerHTML = '';
        for(let i = 0; i < Math.min(this.buffer.length, MAX_CELLS_SHOWN); i++)
        {
            let cell = document.createElement("span");
            if(this.tags && i % 2 != 0)
            {
                cell.classList.add("tag");    
            }
            else
            {
                cell.classList.add("data");
            }
            let value = this._get(i);
            if(value === null || value === undefined)
            {
                value = "-";
            }
            cell.innerHTML = "" + value;
            this.element.appendChild(cell);

            cell.addEventListener("animationend", this._onAnimationEnd.bind(cell));
        }
        if(this.buffer.length > MAX_CELLS_SHOWN)
        {
            let more = document.createElement("span");
            more.classList.add("small-text");
            more.innerHTML = "+ " + (this.buffer.length - MAX_CELLS_SHOWN) +" hidden cells...";
            this.element.appendChild(more);
        }
    }

    _animateAccess(addr, className)
    {
        if(addr < this.element.childNodes.length)
        {
            let cell = this.element.childNodes[addr];
            cell.classList.add(className);
        }
    }

    _setAnimationSpeed(speed)
    {
        this.animationSpeed = speed;
    }

    _onAnimationEnd(event)
    {
        switch(event.animationName)
        {
            case "pulse-green":
                this.classList.remove("read");
                break;
            case "pulse-red":
                this.classList.remove("written");
                break;
            case "pulse-both":
                this.classList.remove("read");
                this.classList.remove("written");
                break;
        }
    }

    get size()
    {
    	return this.length;
    }

    set size(newSize)
    {
        this.length = newSize;
    }

    set length(newLength)
    {
        let newBuffer = new Array(newLength).fill(null);
        for(let i = 0; i < Math.min(this.buffer.length, newLength); i++)
        {
            newBuffer[i] = this.buffer[i];
        }
        this.buffer = newBuffer;
        this._initTable();
    }

    get length()
    {
    	return this.buffer.length;
    }

    get showTags()
    {
        return this.tags;
    }

    set showTags(showTags)
    {
        this.tags = showTags;
        this._initTable();
    }
}