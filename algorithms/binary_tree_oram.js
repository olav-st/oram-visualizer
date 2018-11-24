export default`/*
Based on Oblivious RAM with O((logN)^3) Worst-Case Cost
by Shi et.al (https://eprint.iacr.org/2011/407.pdf)
*/

const gamma = 2; //eviction rate

const depth  = Math.ceil(Math.log2(memory.size /  Math.ceil(Math.log2(memory.size))));
const numBlocks = Math.pow(2, depth);
const bucketSize = Math.floor((memory.size / 2) / (Math.pow(2, depth) - 1));

//memory.size = memory.size * Math.ceil(Math.log2(memory.size));
memory.showTags = true;
tree.depth = depth;
tree.bucketSize = bucketSize;

//Inital setup (create leaf map)
let leafMap = new Array(numBlocks);
for(let i = 0; i < numBlocks; i++)
{
    leaf = getRandomLeafPath(depth);
    leafMap[i] = leaf;
}

function read(addr)
{
    let [tag, data] = readAndRemove(addr);
    add(tag, data);
    return data;
}

function write(addr, data)
{
    readAndRemove(addr);
    add(addr, data);
}

function readAndRemove(tag)
{
    let leaf = leafMap[tag];
    let data = null;
    //Traverse path to leaf
    for(let node of tree.getNodesOnPathTo(leaf))
    {
        let [tmpTag, tmpData] = node.value.popBlock(tag);
        if(tmpData != null)
        {
            data = tmpData;
            tag = tmpTag;
        }
    }
    //Pick new random leaf and update leafMap
    newLeaf = getRandomLeafPath(depth);
    leafMap[tag] = newLeaf;

    if(data != null)
    {
        return [tag, data];
    }
    return [null, null];
}

function add(addr, data)
{
    while(!tree.root.value.pushBlock(addr, data))
    {
        console.warn("error condition for d:", data, "t:", addr, ": root was full");
        evict(gamma);
    }
    evict(gamma);
}

function evict(rate)
{
    for(let d = 0; d < depth -1; d++)
    {
        let nodes = selectRandom(tree.getNodesAtDepth(d), rate);
        
        for(let node of nodes)
        {
            let bucket = node.value;
            let [tag, data] = bucket.popBlock();
            let b = getRandomInt(0, 1);
            let leafPath = leafMap[tag];
            if(leafPath)
            {
                b = leafPath[d];
            }
            let written = false;
            if(b == 0)
            {
                written = node.children[0].value.pushBlock(tag, data);
            }else
            {
                node.children[0].value.pushBlock(null, null);
            }
            if(b == 1)
            {
                written = node.children[1].value.pushBlock(tag, data);
            }else
            {
                node.children[1].value.pushBlock(null, null);
            }
            if(!written && tag != null)
            {
                //Failed to evict this block. This should never happen
                console.warn("error condition for d:", data, "t:", tag, ": bucket overflow");
                leafMap[tag] = getRandomLeafPath(depth);
                add(tag, data);
            }
        }
        //await sleep(1000*speed);
    }
}

function selectRandom(arr, num)
{
    const shuffled = arr.sort(() => .5 - Math.random());
    return shuffled.slice(0,num);   
}

function getRandomLeafPath(depth)
{
    let leafPath = [];
    for(let i = 0; i < depth -1; i++)
    {
        leafPath.push(getRandomInt(0, 1));
    }
    return leafPath;
}

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}`;