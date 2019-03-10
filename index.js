import MemoryElement from './elements/memory';
import MemoryViewElement from './elements/memory_view';
import BinaryTreeElement from './elements/binary_tree';
import NullORAM from './algorithms/null_oram';
import TrivialORAM from './algorithms/trivial_oram';
import SquareRootORAM from './algorithms/square_root_oram';
import BinaryTreeORAM from './algorithms/binary_tree_oram';
import NullTest from './tests/null_test';
import SimpleAddRetrieveTest from './tests/simple_add_retrieve';
import Sort16Test from './tests/sort_16';
import Sum8Test from './tests/sum_8';

const DEFAULT_MEMORY_SIZE = 32;

let memory = null;
let permuted = null;
let shelter = null;
let tree = null;
let speed = 0.5;

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function read(addr)
{
    let tmp = document.getElementById('algorithm-frame').contentWindow.read(addr);
    updateStatistics(memory);
    await sleep(1000*speed);
    return tmp;
}

async function write(addr, data)
{
    document.getElementById('algorithm-frame').contentWindow.write(addr, data);
    updateStatistics(memory);
    await sleep(1000*speed);
}

function onAlgorithmSelectorChanged(event)
{
    let editor = document.getElementById('editor');
    switch(event.target.value)
    {
        case "none":
            editor.value = NullORAM;
            setLogicalView(null);
            break;
        case "trivial":
            editor.value = TrivialORAM;
            setLogicalView(null);
            break;
        case "square-root":
            editor.value = SquareRootORAM;
            setLogicalView('square-root');
            break;
        case "binary-tree":
            editor.value = BinaryTreeORAM;
            setLogicalView('tree');
            break;
        default:
            editor.value = NullORAM;
            setLogicalView(null);
            break;
    }
    if(event.target.value == "custom")
    {
        editor.disabled = false;
    }
    else
    {
        editor.disabled = true;
    }
    onEditorInput({target: editor});
}

function onEditorInput(event)
{
    //Hacky way to check if algorithm uses the tree view
    if(event.target.value.indexOf("tree.") == -1)
    {
        document.getElementById('tree').classList.add("disabled");
    }else
    {
        document.getElementById('tree').classList.remove("disabled");
    }
}

function onSpeedChanged(event)
{
    speed = (100 - event.target.value) / 100;
    memory._setAnimationSpeed(speed);
    //Hack to change animation duration
    for(let rule of document.styleSheets[0].cssRules)
    {
        switch(rule.selectorText)
        {
            case ".read":
            case ".written":
            case ".read.written":
                rule.style.animationDuration = ((speed+0.001)/2) + "s";
                break;
            default:
                break;
        }
    }
}

function onHideMemoryChanged(event)
{
    if(event.target.checked)
    {
        document.getElementById('memory').classList.add("blurry-text");
        document.getElementById('tree').classList.add("blurry-text");
    }
    else
    {
        document.getElementById('memory').classList.remove("blurry-text");
        document.getElementById('tree').classList.remove("blurry-text");
    }
}

function onMemorySizeChanged(event)
{
    memory.size = parseInt(event.target.value);
    tree.depth = Math.ceil(Math.log2(memory.size /  Math.ceil(Math.log2(memory.size))));
    tree.bucketSize = Math.floor((memory.size / 2) / (Math.pow(2, tree.depth) - 1));  
}

function updateStatistics(memory)
{
    const totalAccesses = memory.numReads + memory.numWrites;
    document.getElementById('total-reads').innerHTML = memory.numReads;
    document.getElementById('percent-reads').innerHTML = (memory.numReads * 100 / totalAccesses).toFixed(0);
    document.getElementById('total-writes').innerHTML = memory.numWrites;
    document.getElementById('percent-writes').innerHTML = (memory.numWrites * 100 / totalAccesses).toFixed(0);
    document.getElementById('total-accesses').innerHTML = totalAccesses;
}

function setLogicalView(view)
{
    if(view == "tree")
    {
        document.getElementById('tree').classList.remove("disabled");
    }
    else
    {
        document.getElementById('tree').classList.add("disabled");
    }
    if(view == "square-root")
    {
        document.getElementById('square-root').classList.remove("disabled");
    }
    else
    {
        document.getElementById('square-root').classList.add("disabled");   
    }
    if(view == null || view == "none")
    {
        document.getElementById('none').classList.remove("disabled");
    }
    else
    {
        document.getElementById('none').classList.add("disabled");   
    }
}

async function runSimulation(event)
{
    memory.showTags = false;
    memory.clear();
    memory.resetStatistics();

    document.getElementById('run-button').disabled = true;
    document.getElementById('testcase-selector').disabled = true;
    document.getElementById('status').innerHTML = "Running test...";

    let editor = document.getElementById('editor');
    let testFrame = document.getElementById('test-frame');
    let algorithmFrame = document.getElementById('algorithm-frame');
    let testcase = document.getElementById('testcase-selector').value;

    algorithmFrame.contentWindow.eval(editor.value);
    if(testcase == "add_retrieve")
    {
        testFrame.contentWindow.eval(SimpleAddRetrieveTest);
    }
    else if(testcase == "sort")
    {
        testFrame.contentWindow.eval(Sort16Test);
    }
    else if(testcase == "sum")
    {
        testFrame.contentWindow.eval(Sum8Test);
    }
    else
    {
        testFrame.contentWindow.eval(NullTest);
    }
    let result = await testFrame.contentWindow.runTest();
    
    console.log("-------------------------------");
    console.log("algo:", document.getElementById('algorithm-selector').value);
    console.log("test:", testcase);
    console.log("memsize:", memory.size);
    console.log("reads:", memory.numReads, "writes:", memory.numWrites, "total:", memory.numReads + memory.numWrites);

    document.getElementById('status').innerHTML = "Result: " + result;
    document.getElementById('run-button').disabled = false;
    document.getElementById('testcase-selector').disabled = false;
}

function main()
{
    //Init memory and tree
    memory = new MemoryElement('memory', new Array(DEFAULT_MEMORY_SIZE), false);
    permuted = new MemoryViewElement('permuted', memory, 0, memory.size / 2 + Math.sqrt(memory.size / 2));
    shelter = new MemoryViewElement('shelter', memory, permuted.length, Math.sqrt(memory.size / 2));
    tree = new BinaryTreeElement('graph', memory, 4);
    //Enable access from iframes
    let algorithmFrame = document.getElementById('algorithm-frame');
    algorithmFrame.contentWindow.memory = memory;
    algorithmFrame.contentWindow.permuted = permuted;
    algorithmFrame.contentWindow.shelter = shelter;
    algorithmFrame.contentWindow.tree = tree;
    algorithmFrame.contentWindow.speed = speed;
    algorithmFrame.contentWindow.sleep = sleep;
    let testFrame = document.getElementById('test-frame');
    testFrame.contentWindow.memory = memory;
    testFrame.contentWindow.tree = tree;
    testFrame.contentWindow.speed = speed;
    testFrame.contentWindow.sleep = sleep;
    testFrame.contentWindow.read = read;
    testFrame.contentWindow.write = write;
    //Init event handlers
    document.getElementById('algorithm-selector').onchange = onAlgorithmSelectorChanged;
    document.getElementById('editor').oninput = onEditorInput;
    document.getElementById('speed-slider').onchange = onSpeedChanged;
    document.getElementById('speed-slider').oninput = onSpeedChanged;
    document.getElementById('hide-memory-checkbox').onchange = onHideMemoryChanged;
    document.getElementById('memory-size').onchange = onMemorySizeChanged;
    document.getElementById('run-button').onclick = runSimulation;
    document.getElementById('run-button').disabled = false;
    //Set GUI elements to their default state by triggering events
    let changeEvent = new Event('change');
    document.getElementById('hide-memory-checkbox').checked = false;
    document.getElementById('hide-memory-checkbox').dispatchEvent(changeEvent);
    document.getElementById('speed-slider').value = 50;
    document.getElementById('speed-slider').dispatchEvent(changeEvent);
    document.getElementById('algorithm-selector').dispatchEvent(changeEvent);
    document.getElementById('memory-size').dispatchEvent(changeEvent);
}

window.onload = main;