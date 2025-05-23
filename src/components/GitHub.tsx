import React from "react";
import {Github} from "lucide-react";

interface GitHubButtonProps {
    repoUrl: string;
    label?: string;
    showIcon?: boolean;
    className?: string;
}

const GitHubButton: React.FC<GitHubButtonProps> = ({
                                                       repoUrl,
                                                       label = 'View on GitHub',
                                                       showIcon = true,
                                                       className = '',
                                                   }) => {
    return (
        <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition ${className}`}
        >
            {showIcon && <Github size={20} />}
            <span>{label}</span>
        </a>
    );
};

export default GitHubButton;