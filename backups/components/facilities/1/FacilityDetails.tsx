"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import localImage from '@/assets/sample_rcfe.jpeg'
import localImage2 from '@/assets/sample_rcfe2.jpg'
import localImage3 from '@/assets/sample_rcfe3.jpg'
import {CheckCircle } from "lucide-react"
import React, { useEffect, useRef } from "react"
import Script from 'next/script'
import localPanoramaImage from '@/assets/pannellum.jpg'

interface FacilityDetailsProps {
  name: string
  location: string
  beds: number
  caregivers: number
  topAttributes: string[]
  description: string
  price: number
  images: string[]
}

export function FacilityDetailsComponent({
  name,
  location,
  beds,
  caregivers,
  topAttributes,
  description,
  price,
  images,
}: FacilityDetailsProps) {
  const panoramaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPanorama = () => {
      if (window.pannellum && panoramaRef.current) {
        window.pannellum.viewer(panoramaRef.current, {
          autoLoad: true,
          default: {
            firstScene: "circle",
            sceneFadeDuration: 1000
          },
          scenes: {
            circle: {
              title: "Mason Circle",
              hfov: 110,
              pitch: -3,
              yaw: 0,
              type: "equirectangular",
              panorama: localPanoramaImage.src,
              hotSpots: [
                {
                  pitch: -2.1,
                  yaw: 132.9,
                  type: "scene",
                  text: "Spring House or Dairy",
                  sceneId: "house"
                }
              ]
            },
            house: {
              title: "Spring House or Dairy",
              hfov: 110,
              yaw: 5,
              type: "equirectangular",
              panorama: localPanoramaImage.src,
              hotSpots: [
                {
                  pitch: -0.6,
                  yaw: 37.1,
                  type: "scene",
                  text: "Mason Circle",
                  sceneId: "circle",
                  targetYaw: -23,
                  targetPitch: 2
                }
              ]
            }
          }
        });
      }
    };

    if (window.pannellum) {
      initPanorama();
    } else {
      window.addEventListener('load', initPanorama);
    }

    return () => {
      window.removeEventListener('load', initPanorama);
    };
  }, []);
  
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        strategy="beforeInteractive"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
      />
      <div className="max-w-6xl mx-auto px-15 sm:px-15 lg:px-16 py-8">
        <h1 className="text-4xl font-bold mb-6">{name}</h1>
        
        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-video relative w-full h-full">
              <Image
                src={localImage.src}
                alt={`Main image of ${name}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="aspect-square relative">
                  <Image
                    src={localImage.src}
                    alt={`Image ${index + 2} of ${name}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2">
            <h2 className="text-4xl text-black font-semibold mb-2">{`Cozy Board and Care in ${location}`}</h2>
            <p className="text-base text-muted-foreground mb-4">{`${beds} beds, ${caregivers} caregivers`}</p>
            
            <h2 className="text-2xl font-semibold mb-3">Top Attributes</h2>
          <ul className="space-y-2 mb-6">
            {topAttributes.map((attribute, index) => (
              <li key={index} className="flex items-center text-muted-foreground">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <span>{attribute}</span>
              </li>
            ))}
          </ul>
            
            <h2 className="text-2xl font-semibold mb-3">About the Facility</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          {/* Right Column */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-center mb-4">${price.toLocaleString()}/month</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Patient Directory</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Panorama View */}
        <div className="mt-8 w-full aspect-[2/1]">
          <div ref={panoramaRef} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </>
  )
}