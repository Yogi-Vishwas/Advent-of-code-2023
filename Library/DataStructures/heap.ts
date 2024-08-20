export interface Heap {
    maxHeapify(index: number): void;
    minHeapify(index: number): void;
    buildMaxHeap(): void;
    buildMinHeap(): void;
}

export class BinaryHeap<ElemType extends { key: number }> implements Heap {
    elements: ElemType[];

    constructor(elements: ElemType[]) {
        this.elements = elements;
    }

    getHeapSize() {
        return this.elements.length;
    }

    leftChild(elemIndex: number) {
        return (elemIndex << 1) + 1;
    }

    rightChild(elemIndex: number) {
        return (elemIndex << 1) + 2;
    }

    parent(elemIndex: number) {
        return elemIndex >> 1;
    }

    maxHeapify(elemIndex: number) {
        const left = this.leftChild(elemIndex);
        const right = this.rightChild(elemIndex);
        let largest = elemIndex;

        if (left < this.getHeapSize() && this.elements[left].key > this.elements[largest].key) {
            largest = left;
        }
        if (right < this.getHeapSize() && this.elements[right].key > this.elements[largest].key) {
            largest = right;
        }
        if (largest !== elemIndex) {
            this.swapElems(elemIndex, largest);
            this.maxHeapify(largest);
        }
    }

    buildMaxHeap() {
        const length = this.elements.length;
        for (let elemIndex = Math.floor(length) - 1; elemIndex >= 0; --elemIndex) {
            this.maxHeapify(elemIndex);
        }
    }

    minHeapify(elemIndex: number) {
        const left = this.leftChild(elemIndex);
        const right = this.rightChild(elemIndex);
        let smallest = elemIndex;

        if (left < this.getHeapSize() && this.elements[left].key < this.elements[smallest].key) {
            smallest = left;
        }
        if (right < this.getHeapSize() && this.elements[right].key < this.elements[smallest].key) {
            smallest = right;
        }
        if (smallest !== elemIndex) {
            this.swapElems(elemIndex, smallest);
            this.minHeapify(smallest);
        }
    }

    buildMinHeap() {
        const length = this.elements.length;
        for (let elemIndex = Math.floor(length) - 1; elemIndex >= 0; --elemIndex) {
            this.minHeapify(elemIndex);
        }
    }

    swapElems(index1: number, index2: number) {
        const temp = this.elements[index1];
        this.elements[index1] = this.elements[index2];
        this.elements[index2] = temp;
    }

    printElems() {
        console.log(this.elements);
    }
}
