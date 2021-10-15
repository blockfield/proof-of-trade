import SharedConsts from "../consts/shared-consts";

export default class MathHelper {
    public static numberToBigInt(value: number): bigint {
        return BigInt(value) * BigInt(SharedConsts.nanoBtc)
    }

    public static bigIntToFloorNumber(value: bigint): number {
        return this.floorNumber(Number(value / BigInt(SharedConsts.nanoBtc)))
    }

    public static floorNumber(value: number): number {
        return Math.floor(value)
    }

    public static decimalDigitsNumber(value: number): number {
        return MathHelper.floorNumber(value * (10 ** SharedConsts.maxDecimalDigits))
    }

    public static removeDecimalDigitsNumber(value: number): number {
        return MathHelper.floorNumber(value / (10 ** SharedConsts.maxDecimalDigits))
    }
}