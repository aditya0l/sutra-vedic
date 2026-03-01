export function formatPrice(price: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
    }).format(price);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function getLocalizedValue<T>(obj: { fr: T; en: T }, locale: string): T {
    return locale === 'en' ? obj.en : obj.fr;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + '...';
}

export function generateStarArray(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push('full');
        } else if (rating >= i - 0.5) {
            stars.push('half');
        } else {
            stars.push('empty');
        }
    }
    return stars;
}

export function getStockStatus(stock: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= 10) return 'low_stock';
    return 'in_stock';
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
