import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Pokémon Collection Tracker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Keep track of your Pokémon card collection with detailed information about sets, languages, variants, and
            conditions. Never lose track of what you own again!
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Track Everything
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Record detailed information about each card including language, variant, condition, and quantity.
                Perfect for serious collectors.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Complete Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access a comprehensive database of Pokémon sets and cards from Base Set to the latest releases, with
                accurate card information.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                Collection Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Mark sets you're actively collecting and set your favorite language to focus your collection efforts.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
