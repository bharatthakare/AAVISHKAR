import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, MessageCircle, Send, User, Image as ImageIcon, Video } from 'lucide-react';
import Image from 'next/image';

const communityPosts = [
  {
    id: 1,
    author: 'Ramesh Patel',
    avatar: PlaceHolderImages.find(p => p.id === 'community_avatar_1'),
    time: '2 hours ago',
    content: 'My soybean crop is showing some yellowing on the leaves. Any suggestions on what it could be?',
    image: PlaceHolderImages.find(p => p.id === 'disease_1'),
    likes: 12,
    comments: 4,
  },
  {
    id: 2,
    author: 'Sunita Sharma',
    avatar: PlaceHolderImages.find(p => p.id === 'community_avatar_2'),
    time: '5 hours ago',
    content: 'Just finished setting up my new drip irrigation system. Hoping for a great harvest this year!',
    image: PlaceHolderImages.find(p => p.id === 'community_post_1'),
    likes: 34,
    comments: 9,
  },
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Community Forum"
        subtitle="Connect, share, and learn with fellow farmers."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/user_avatar/100/100" data-ai-hint="person portrait" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <Input placeholder="What's on your mind, farmer?" className="flex-grow" />
            </CardHeader>
            <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><ImageIcon className="mr-2 h-4 w-4" /> Photo</Button>
                    <Button variant="ghost" size="sm"><Video className="mr-2 h-4 w-4" /> Video</Button>
                </div>
              <Button>
                <Send className="mr-2 h-4 w-4" /> Post
              </Button>
            </CardFooter>
          </Card>
          
          {communityPosts.map((post) => (
            <Card key={post.id} className="glass-card">
              <CardHeader className="flex flex-row items-center gap-3">
                <Avatar>
                  {post.avatar && <AvatarImage src={post.avatar.imageUrl} alt={post.author} data-ai-hint={post.avatar.imageHint} />}
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
                {post.image && (
                  <div className="mt-4 rounded-lg overflow-hidden border">
                    <Image
                      src={post.image.imageUrl}
                      alt="Post image"
                      width={800}
                      height={600}
                      className="object-cover w-full"
                      data-ai-hint={post.image.imageHint}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="ghost" size="sm">
                  <Heart className="mr-2 h-4 w-4" /> {post.likes} Likes
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" /> {post.comments} Comments
                </Button>
                <Button variant="ghost" size="sm">
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="md:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="text-primary hover:underline cursor-pointer">#MonsoonPrep</li>
                <li className="text-primary hover:underline cursor-pointer">#OrganicFarming</li>
                <li className="text-primary hover:underline cursor-pointer">#WheatHarvest2024</li>
                <li className="text-primary hover:underline cursor-pointer">#PestControl</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
