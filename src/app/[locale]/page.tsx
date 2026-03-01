import HeroSection from '@/components/home/HeroSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoriesSection from '@/components/home/CategoriesSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <BenefitsSection />
            <FeaturedProducts />
            <CategoriesSection />
            <ReviewsSection />
            <NewsletterSection />
        </>
    );
}
