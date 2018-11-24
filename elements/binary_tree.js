import BucketElement from './bucket';

export default class BinaryTreeElement 
{
    constructor(elementID, memory) 
    {
        this.tree = document.getElementById("tree");
        this.memory = memory;
        this.d = Math.ceil(Math.log2(memory.size /  Math.ceil(Math.log2(memory.size))));
        this.bs = Math.floor((memory.size / 2) / (Math.pow(2, this.d) - 1)) * 2;        

        this.nodes = [
            {
                name: 'Root',
                value: null,
                element: document.createElement("li"),
                children: []
            }
        ];
        this.options = {
            series : [
                {
                    data: this.nodes
                }
            ]
        };
        this._initTree();
    }

    _initTree()
    {
        //Setup HTML elements for root
        let rootBucket = document.createElement("div");
        rootBucket.classList.add("bucket");
        this.root.element.innerHTML = "";
        this.root.element.appendChild(rootBucket);
        this.root.element.appendChild(document.createElement("ul"));
        //Add elements
        this.tree.innerHTML = "";
        this.tree.appendChild(document.createElement("ul"));
        this.tree.getElementsByTagName("ul")[0].appendChild(this.root.element);
        //Generate and init children
        this.nodes[0].children = this._generateChildren(this.nodes[0], 1, this.depth);
        this._initBuckets();
    }

    _generateChildren(node, depth, maxDepth)
    {
        if(depth < maxDepth)
        {
            const left = {
                name: 'L' + depth,
                value: null,
                element: document.createElement("li"),
                children: []
            };
            const right = {
                name: 'R' + depth,
                value: null,
                element: document.createElement("li"),
                children: []
            };
            //Init elements
            for(let element of [left.element, right.element])
            {
                let bucket = document.createElement("div");
                bucket.classList.add("bucket");
                element.appendChild(bucket);
                if(depth != maxDepth - 1)
                {
                    element.appendChild(document.createElement("ul"));
                }
            }
            //Add elements to parents list
            let parentsChildrenList = node.element.getElementsByTagName('ul')[0];
            parentsChildrenList.appendChild(left.element);
            parentsChildrenList.appendChild(right.element);
            //Generate children
            left.children = this._generateChildren(left, depth + 1, maxDepth);
            right.children = this._generateChildren(right, depth + 1, maxDepth);
            return [left, right];
        }

        return [];
    }

    _initBuckets()
    {
        let i = 0;
        let queue = [];
        queue.unshift(this.nodes[0]);
        while(queue.length > 0)
        {
            let node = queue.shift();

            node.name = "" + i;
            let bucketElement = node.element.getElementsByTagName('div')[0];
            bucketElement.id = "bucket" + i;
            node.value = new BucketElement(bucketElement.id, this.memory, i *  2 * this.bucketSize, 2 * this.bucketSize);

            for (let n of node.children) {
                queue.unshift(n);
            }
            i++;
        }
    }

    getNode(addr)
    {
        let node = this.root;
        for(let i of addr)
        {
            node = node.children[i];
        }
        return node;
    }

    getAllNodes()
    {
        let i = 0;
        let queue = [];
        let nodes = [];
        queue.unshift(this.nodes[0]);
        while(queue.length > 0)
        {
            let node = queue.shift();

            nodes.push(node);

            for (let n of node.children) {
                queue.unshift(n);
            }
            i++;
        }
        return nodes;
    }

    getNodesAtDepth(depth)
    {
        let nodes = new Array(Math.pow(2, depth));
        for(let i = 0; i < nodes.length; i++)
        {
            let addr = new Array(Math.log2(nodes.length));
            for(let j = 0; j < addr.length; j++)
            {
                addr[j] = i >> j & 1;
            }
            nodes[i] = this.getNode(addr);
        }
        return nodes;
    }

    getNodesOnPathTo(addr)
    {
        let nodesOnPath = [this.root];
        let node = this.root;
        for(let i of addr)
        {
            node = node.children[i];
            nodesOnPath.push(node);
        }
        return nodesOnPath;
    }

    set depth(depth)
    {
        this.d = depth;
        this._initTree();
    }

    get depth()
    {
        return this.d;
    }

    set bucketSize(bucketSize)
    {
        this.bs = Math.ceil(2 * bucketSize);
        this._initTree();
    }

    get bucketSize()
    {
        return Math.ceil(this.bs / 2);
    }

    get root()
    {
        return this.nodes[0];
    }
}