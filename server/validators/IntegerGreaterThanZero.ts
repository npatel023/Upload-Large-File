class IntegerGreaterThanZero {
    private value: number

    constructor(value: number) {
        this.value = value
    }

    validate(): boolean {
        return this.value > 0
    }

    getErrorMessage(): string {
        return 'Input value must be greater than zero'
    }
}

export default IntegerGreaterThanZero