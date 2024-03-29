type Store = Array<{
    size: number
    quantity: number
}>

type Order = Array<{
    id: number
    size: [number]
} | {
    id: number
    size: [number, number]
    masterSize: "s1" | "s2"
}>

type Result = {
    stats: Array<{ size: number, quantity: number }>
    assignment: Array<{ id: number, size: number }>
    mismatches: number
}

const process = (store: Store, order: Order): Result | false => {
    const availableSizes = store.map(item => item.size);
    const result: Result = { stats: [], assignment: [], mismatches: 0 };
    for (const customer of order) {
        let selectedSize = -1;
        if (customer.size.length === 1) {
            selectedSize = availableSizes.indexOf(customer.size[0]);
        } else if (customer.size.length === 2 && 'masterSize' in customer) {
            if (customer.masterSize === "s1") {
                selectedSize = availableSizes.indexOf(customer.size[0]);
            } else if (customer.masterSize === "s2") {
                selectedSize = availableSizes.indexOf(customer.size[1]);
            }
        }
        if (selectedSize !== -1 && store[selectedSize].quantity > 0) {
            store[selectedSize].quantity--;
            result.assignment.push({ id: customer.id, size: store[selectedSize].size });
        } else {
            result.mismatches++;
        }
    }
    result.stats = store.filter(item => item.quantity < item.size).sort((a, b) => a.size - b.size);
    return result.mismatches === 0 ? result : false;
};

const tests = [
    {
        store: [{ size: 2, quantity: 1 }],
        order: [{ id: 102, size: [1, 2], masterSize: "s1" }],
        isPossible: true,
        mismatches: 1,
    },
    {
        store: [{ size: 3, quantity: 1 }],
        order: [{ id: 102, size: [1, 2], masterSize: "s1" }],
        isPossible: false,
        mismatches: 0,
    },
    {
        store: [{ size: 2, quantity: 4 }],
        order: [
            { id: 101, size: [2] },
            { id: 102, size: [1, 2], masterSize: "s2" },
        ],
        isPossible: true,
        mismatches: 0,
    },
    {
        store: [
            { size: 1, quantity: 1 },
            { size: 2, quantity: 2 },
            { size: 3, quantity: 1 },
        ],
        order: [
            { id: 100, size: [1] },
            { id: 101, size: [2] },
            { id: 102, size: [2, 3], masterSize: "s1" },
            { id: 103, size: [1, 2], masterSize: "s2" },
        ],
        isPossible: true,
        mismatches: 1,
    }
];

for (const test of tests) {
    // @ts-ignore
    const result = process(test.store, test.order);
    console.log(result)
}
