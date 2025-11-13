import promedio from "@/app/functions/promedio";


describe('promedio', () => {
  it('calcula el promedio de un array de números', () => {
    expect(promedio([2, 4, 6])).toBe(4);
    expect(promedio([1, 3, 5, 7])).toBe(4);
  }) 
});