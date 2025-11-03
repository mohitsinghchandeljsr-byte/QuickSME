import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Github, GitBranch, Star, GitFork, Search, ExternalLink, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GitHubIntegration() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: userInfo, isLoading: userLoading } = useQuery<any>({
    queryKey: ['/api/github/user'],
  });

  const { data: repositories, isLoading: reposLoading } = useQuery<any[]>({
    queryKey: ['/api/github/repos'],
  });

  const handleBackupToRepo = (repoName: string) => {
    toast({
      title: "Backup Initiated",
      description: `Creating backup in repository: ${repoName}`,
    });
  };

  const handleSyncRepo = (repoName: string) => {
    toast({
      title: "Sync Started",
      description: `Syncing accounting data with ${repoName}`,
    });
  };

  const filteredRepos = repositories?.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Github className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">GitHub Integration</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sync your accounting data with GitHub repositories
            </p>
          </div>
        </div>

        {userLoading ? (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
              </div>
            </div>
          </Card>
        ) : userInfo ? (
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-4">
              <img
                src={userInfo.avatar_url}
                alt={userInfo.name || userInfo.login}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {userInfo.name || userInfo.login}
                </h2>
                <p className="text-sm text-muted-foreground">@{userInfo.login}</p>
                {userInfo.bio && (
                  <p className="text-sm text-muted-foreground mt-2">{userInfo.bio}</p>
                )}
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold font-mono text-foreground">{userInfo.public_repos}</p>
                  <p className="text-muted-foreground">Repos</p>
                </div>
                <div className="text-center">
                  <p className="font-bold font-mono text-foreground">{userInfo.followers}</p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold font-mono text-foreground">{userInfo.following}</p>
                  <p className="text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 mb-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <p className="text-foreground">GitHub account not connected. Please connect your GitHub account to use this feature.</p>
          </Card>
        )}

        <Card className="mb-6">
          <div className="p-6 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
        </Card>

        {reposLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-full animate-pulse" />
                  <div className="h-3 bg-muted rounded w-4/5 animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRepos.map((repo, idx) => (
              <Card key={repo.id} className="p-6 hover-elevate" data-testid={`repo-card-${idx}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-semibold text-foreground">{repo.name}</h3>
                  </div>
                  <Badge variant={repo.private ? "secondary" : "default"} className="text-xs">
                    {repo.private ? "Private" : "Public"}
                  </Badge>
                </div>
                
                {repo.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    {repo.forks_count}
                  </div>
                  {repo.default_branch && (
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {repo.default_branch}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleBackupToRepo(repo.name)}
                    data-testid={`button-backup-${idx}`}
                  >
                    Backup Data
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSyncRepo(repo.name)}
                    data-testid={`button-sync-${idx}`}
                  >
                    Sync
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    data-testid={`button-view-${idx}`}
                  >
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Github className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No repositories found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm ? "Try a different search term" : "You don't have any repositories yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
