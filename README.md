# QRGen

QRGen is a web application that allows users to generate custom QR codes for various purposes such as websites, products, contacts, and events. It provides an easy-to-use interface for creating QR codes with customizable styles and settings.

## Demo

 ![](https://github.com/RJohnPaul/QRGen/blob/82dba01418449df23c034dfb6455ce678a4410ff/gif.gif)

## Features

- Generate QR codes for websites, products, contacts, events, and more
- Customize the QR code style, including color, shape, and error correction level
- Responsive design for seamless usage on different devices
- Real-time preview of the generated QR code
- Download the QR code as a PNG image
- Dark and light mode toggle for improved user experience
- Placeholder suggestions for easy input
- Progress bar to indicate QR code generation progress
- Toast notifications for success and error messages
- Testimonial section to showcase user feedback

## Technologies Used

- Next.js: A React framework for building server-side rendered and static websites
- React: A JavaScript library for building user interfaces
- Tailwind CSS: A utility-first CSS framework for rapid UI development
- node-fetch: A lightweight module for making HTTP requests
- RapidAPI: An API marketplace used for generating QR codes

## Getting Started

To run QRGen locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/RJohnPaul/QRGen.git
   ```

2. Install the dependencies:

   ```bash
   cd QRGen
   npm install
   ```

3. Set up the environment variables:

   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     NEXT_PUBLIC_RAPID_API_KEY=your-rapid-api-key
     NEXT_PUBLIC_RAPID_API_HOST=your-rapid-api-host
     ```
   - Replace `your-rapid-api-key` and `your-rapid-api-host` with your actual RapidAPI credentials
   - API From RapidAPI - `https://rapidapi.com/linqr-linqr-default/api/qrcode3`

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see QRGen in action!

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgements

- [RapidAPI](https://rapidapi.com/) for providing the QR code generation API
- [Next.js](https://nextjs.org/) for the awesome React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [node-fetch](https://www.npmjs.com/package/node-fetch) for making HTTP requests
- [React](https://reactjs.org/) for the powerful JavaScript library

## Contact

If you have any questions or suggestions, feel free to reach out to me:

- Email: iamjohnpaulr5@gmail.com
- [Twitter](https://twitter.com/iamjohnpaulr5)
- [Website](https://john-porfolio.vercel.app)

Happy QR code generating with QRGen!
