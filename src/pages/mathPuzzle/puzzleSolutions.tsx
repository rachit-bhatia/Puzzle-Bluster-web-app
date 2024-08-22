const solutionsEasy: { level1: string[]; level2: string[]; level3: string[]; } = {
    level1: ["2*3=6", "3-1=2", "9/3=3"],
    level2: ["5-2=3", "3+3=6", "6/2=3"],
    level3: ["1+1=2", "7-4=3", "8-2=6"],
};

const solutionsMedium: { level1: string[]; level2: string[]; level3: string[]; } = {
    level1: ["5-2=3", "8/8=1", "6+3=9", "7-7=0", "3*2=6"],
    level2: ["4/4=1", "9/9=1", "2+2=4", "7*2=14", "6/2=3"],
    level3: ["8-8=0", "1-1=0", "4*2=8", "9*2=18", "3-3=0"]
};

const solutionsHard: { level1: string[]; level2: string[]; level3: string[]; } = {
    // level1: ["7+2=9", "8-6=2", "9/3=3"],
    // level2: ["4*2=8", "9-7=2", "3+5=8"],
    // level3: ["6/3=2", "5+5=10", "10-8=2"]
    level1: [
        "2+3=5",
        "5-1=4",
        "2*2=4",
        "4-2=2",
        "6/2=3",
        "3+1=4",
        "8-4=4"
    ],
    level2: [
        "4*2=8",
        "8-4=4",
        "9/3=2",
        "7-3=4",
        "9/3=3",
        "6+2=8",
        "9-7=2"
    ],
    level3: [
        "3*3=9",
        "4+5=9",
        "8/4=2",
        "9-5=4",
        "9/3=3",
        "8-6=2",
        "7+1=8"
    ]
};

export { solutionsEasy, solutionsMedium, solutionsHard };