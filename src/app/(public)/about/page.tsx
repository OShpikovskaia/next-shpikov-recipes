import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About project | Shpikov's recipes",
  description:
    'Small pet project for practicing Next.js, Auth.js, Prisma and Feature-Sliced Design.',
};

const AboutPage = () => {
  return (
    <section className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
      <p>
        At <strong>Shpikov&apos;s recipes</strong>, we believe that healthy living is not about
        strict rules or limitations — it&rsquo;s about nourishing your body, feeling energized, and
        enjoying food that supports your well-being. A balanced lifestyle starts with simple daily
        choices: fresh ingredients, mindful cooking, and habits that help you feel your best every
        single day.
      </p>
      <p>
        <b>Our mission</b> is to make healthy eating accessible, inspiring, and delicious. We share
        recipes that are easy to prepare, full of flavor, and created to support a vibrant, active
        life. Whether you&rsquo;re just starting your wellness journey or looking to deepen your
        commitment to healthy living, we&rsquo;re here to guide you with practical tips, wholesome
        ideas, and food that makes you feel good from the inside out.
      </p>
      <p>Because taking care of yourself should feel joyful — not complicated.</p>
      <h2>
        Welcome to a healthier, happier way of living with <strong>Shpikov&apos;s recipes</strong>.
      </h2>
    </section>
  );
};

export default AboutPage;
