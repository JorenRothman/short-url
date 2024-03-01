import million from 'million/compiler';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
        return config;
    },
};

const millionConfig = {
    auto: {
        rsc: true,
        mute: true,
    },
};

export default million.next(nextConfig, millionConfig);
