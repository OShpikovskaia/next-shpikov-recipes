export const siteConfig = {
  title: "Shpikov's recipes",
  description: "Shpikov's healthy lifestyle recipes",
  navItems: [
    { href: '/', label: 'Recipes' },
    { href: '/ingredients', label: 'Ingredients' },
    { href: '/about', label: 'About us' },
  ],
  pagesContent: {
    '/': {
      content: 'Home page content...',
    },
    '/ingredients': {
      content: 'Ingredients page content...',
    },
    '/about': {
      content: `
                <p>At Shpikov’s Recipes, we believe that healthy living is not about strict rules or limitations — it’s about nourishing your body, feeling energized, and enjoying food that supports your well-being. A balanced lifestyle starts with simple daily choices: fresh ingredients, mindful cooking, and habits that help you feel your best every single day.</p>
                <br>
                <p><b>Our mission</b> is to make healthy eating accessible, inspiring, and delicious. We share recipes that are easy to prepare, full of flavor, and created to support a vibrant, active life. Whether you're just starting your wellness journey or looking to deepen your commitment to healthy living, we’re here to guide you with practical tips, wholesome ideas, and food that makes you feel good from the inside out.</p>
                <br>
                <p>Because taking care of yourself should feel joyful — not complicated.</p>
                <br>
                <h2>Welcome to a healthier, happier way of living with Shpikov’s Recipes.</h2>
            `,
    },
  },
} as const;
