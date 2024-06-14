export const generateColumnStyle = (index:number,total = 1) => {
    const intensity = 70 - (index / (total - 1)) * 50

    return {backgroundColor: `hsla(280,62%,${intensity}%,40%)`}
}