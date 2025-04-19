// List of common stop words to exclude
const stopWords = new Set([
    'about', 'which', 'these', 'those', 'therefore', 'around', 'during', 'other',
    'your', 'with', 'have', 'this', 'that', 'there', 'where', 'their', 'from',
    'after', 'before', 'while', 'could', 'would', 'should', 'being', 'among',
    'again', 'amongst', 'than', 'when', 'while', 'through', 'between', 'over',
    'under', 'such', 'also', 'many', 'some', 'more', 'most', 'very', 'them', 'they',
    'into', 'each', 'been', 'because', 'every', 'both', 'within'
]);

export function isStopWord(word) {
    return stopWords.has(word.toLowerCase());
}


export function extractCandidateKeywords(tours) {
    const wordSet = new Set();

    tours.forEach(tour => {
        const desc = tour.desc || '';
        const words = desc.toLowerCase().split(/\W+/);

        words.forEach(word => {
            if (word.length > 4 && !isStopWord(word)) {
                wordSet.add(word);
            }
        });
    });

    return Array.from(wordSet);
}