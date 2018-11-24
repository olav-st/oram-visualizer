export default`let pos_map = new Array(memory.length);
let height  = Math.ceil(Math.log2(memory.length)) + 1;
let n_blocks = Math.pow(2, (height - 1));

tree.height = height;

function read(addr)
{
    return access(addr);
}

function write(addr, data)
{
    return access(addr, data);
}

function access(addr, data)
{
	//TODO
}`;