"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/data/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Mail } from "lucide-react";
function Home() {
    return (
        <>
            <main className="h-[658px] flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
                <section className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold">
                        Dive into the World of Anonymous Message
                    </h1>
                    <p className="mt-3 md:mt-4 text-base md:text-lg">
                        Mystry Message - Where your identity remains a secret.
                    </p>
                </section>
                <Carousel
                    plugins={[Autoplay({ delay: 1500 })]}
                    className="w-full max-w-xs"
                >
                    <CarouselContent>
                        {messages.map((message, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                {message.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                                            <Mail className="flex-shrink-0" />
                                            <div>
                                                <p>{message.content}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {message.received}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </main>
            <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
                © 2025 Mystry Message. All rights reserved.
            </footer>
        </>
    );
}

export default Home;
