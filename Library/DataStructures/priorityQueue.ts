import { BinaryHeap } from './heap';

export interface PriorityQueue<ElemType extends { key: number }> {
    insert(element: ElemType): void;
    extractRoot(): ElemType | null;
    peek(): ElemType | null;
}

export class MaxPriorityQueue<ElemType extends { key: number }> implements PriorityQueue<ElemType> {
    private heap: BinaryHeap<ElemType>;

    constructor(elements: ElemType[]) {
        this.heap = new BinaryHeap<ElemType>(elements);
        this.heap.buildMaxHeap();
    }

    get length() {
        return this.heap.getHeapSize();
    }

    insert(element: ElemType) {
        const key = element.key;
        element.key = -Infinity;
        this.heap.elements.push(element);
        const lastIndex = this.heap.getHeapSize() - 1;
        this.increaseKey(element, () => lastIndex, key); // getIndex function always returns the lastIndex as we are always inserting the new element at the end of the array.
    }

    increaseKey(element: ElemType, getIndex: (elem: ElemType, elemList: ElemType[]) => number, newKey: number) {
        if (newKey < element.key) throw new Error("Can't increase key, new key is smaller than current key");

        let index = getIndex(element, this.heap.elements);
        this.heap.elements[index].key = newKey;

        const isParentKeySmaller = (elemIndex: number) => {
            return this.heap.elements[this.heap.parent(elemIndex)].key <
                this.heap.elements[elemIndex].key;
        }
        while (index > 0 && isParentKeySmaller(index)) {
            this.heap.swapElems(index, this.heap.parent(index));
            index = this.heap.parent(index);
        }
    }

    extractRoot(): ElemType | null {
        if (!this.heap.getHeapSize()) return null;
        const max = this.heap.elements[0];

        if (this.heap.getHeapSize() === 1) {
            this.heap.elements = [];
            return max;
        }
        this.heap.elements[0] = this.heap.elements.pop()!;
        this.heap.maxHeapify(0);
        return max;
    }

    peek(): ElemType | null {
        if (!this.heap.getHeapSize()) return null;
        const max = this.heap.elements[0];
        return max;
    }

    show() {
        console.log(this.heap.printElems());
    }
}


export class MinPriorityQueue<ElemType extends { key: number }> implements PriorityQueue<ElemType> {
    private heap: BinaryHeap<ElemType>;

    constructor(elements: ElemType[]) {
        this.heap = new BinaryHeap<ElemType>(elements);
        this.heap.buildMinHeap();
    }

    get length() {
        return this.heap.getHeapSize();
    }

    insert(element: ElemType) {
        const key = element.key;
        element.key = Infinity;
        this.heap.elements.push(element);
        const lastIndex = this.heap.getHeapSize() - 1;
        this.decreaseKey(element, () => lastIndex, key); // Here in the getIndex function I returned heapSize - 1 as the newly inserted element will always be at that index.
    }

    decreaseKey(element: ElemType, getIndex: (elem: ElemType, elemList: ElemType[]) => number, newKey: number) {
        if (newKey >= element.key) throw new Error("Can't decrease key, new key is bigger than current key");

        let index = getIndex(element, this.heap.elements);
        this.heap.elements[index].key = newKey;

        const isParentKeyBigger = (elemIndex: number) => {
            return this.heap.elements[this.heap.parent(elemIndex)].key >
                this.heap.elements[elemIndex].key;
        }
        while (index > 0 && isParentKeyBigger(index)) {
            this.heap.swapElems(index, this.heap.parent(index));
            index = this.heap.parent(index);
        }
    }

    extractRoot(): ElemType | null {
        if (!this.heap.getHeapSize()) return null;
        const min = this.heap.elements[0];

        if (this.heap.getHeapSize() === 1) {
            this.heap.elements = [];
            return min;
        }
        this.heap.elements[0] = this.heap.elements.pop()!;
        this.heap.minHeapify(0);
        return min;
    }

    peek(): ElemType | null {
        if (!this.heap.getHeapSize()) return null;
        const min = this.heap.elements[0];
        return min;
    }

    show() {
        this.heap.printElems();
    }
}

/* const elements = [
    { key: 4, name: '4' },
    { key: 1, name: '1' },
    { key: 3, name: '3' },
    { key: 2, name: '2' },
    { key: 16, name: '16' },
    { key: 9, name: '9' },
    { key: 10, name: '10' },
    { key: 14, name: '14' },
    { key: 8, name: '8' },
    { key: 7, name: '7' },
];

const q = new MaxPriorityQueue<{ key: number, name: string }>([...elements]);
q.insert({ key: 13, name: '13' });
q.show();
const r = new MinPriorityQueue<{ key: number; name: string }>([...elements]);
r.insert({ key: 13, name: '13' });
r.insert({ key: 13, name: '13' });
r.insert({ key: 17, name: '17' });
r.insert({ key: 5, name: '5' });
r.show(); */
