describe('Describe the panda',function(){
  it('The panda should be happy',function(){
    expect(panda).toBe('happy');
  });
    it('The panda should has 3 panditas',function(){
      expect(Panda.count_panditas()).toBe(3);
  });
});

describe('Describe the Zoo',function(){
    it('The zoo should be closed at day',function(){
    hour = 9
    expect(Zoo.open(hour)).toBe(true);
  });
});
