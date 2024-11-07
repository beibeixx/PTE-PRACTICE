export const processData = (rsSentences, wfdSentences) => {
    const processedData = [
        ...rsSentences.map((text, index) => ({
            id: `rs-${index + 1}`,
            category: 'rs',
            text
        })),
        ...wfdSentences.map((text, index) => ({
            id: `wfd-${index + 1}`,
            category: 'wfd',
            text
        }))
    ];
    
    return processedData;
};