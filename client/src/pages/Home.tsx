import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, Zap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-lg">
            <Zap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Skill<span className="text-primary">Forge</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to SkillForge - where learning meets innovation. Experience our beautiful login and register pages built with Tailwind CSS and ShadCN UI.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Login Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
                <LogIn className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription className="text-lg">
                Access your existing account with our beautiful login interface
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/login">
                <Button size="lg" className="w-full text-lg py-6">
                  Go to Login Page
                  <LogIn className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Register Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription className="text-lg">
                Create a new account with our intuitive registration form
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full text-lg py-6">
                  Go to Register Page
                  <UserPlus className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Features Showcase</CardTitle>
            <CardDescription className="text-lg">
              Built with modern web technologies for the best user experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">TW</span>
                </div>
                <h3 className="font-semibold mb-2">Tailwind CSS</h3>
                <p className="text-muted-foreground text-sm">
                  Beautiful, responsive design with utility-first CSS framework
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">UI</span>
                </div>
                <h3 className="font-semibold mb-2">ShadCN UI</h3>
                <p className="text-muted-foreground text-sm">
                  High-quality, accessible components built with Radix UI
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">RV</span>
                </div>
                <h3 className="font-semibold mb-2">React + Vite</h3>
                <p className="text-muted-foreground text-sm">
                  Fast development with hot reload and TypeScript support
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Built with ❤️ using React, TypeScript, Tailwind CSS, and ShadCN UI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 