# CaptainWebHook

CaptainWebHook is a small node.js based App, that can create WebHook-Endpoints that execute small scripts then called.

## Install CaptainWebHook

### 1. Install the node_modules

Navigate in the CaptainWebHook folder and run `npm install` or run `install-modules` from vsCode.

### 2. Setup the config file 

Change the name of the `config.json.template` file to `config.json` and adapt the settings to your needs.

### 3. Setup a Linux Service

Go into the CaptainWebHook repo and make the start.sh executable with:

```bash
chmod u+x start.sh
```

Then copy the `captain_webhook.service` to `/etc/systemd/system/` and and adjust the repo-path in the service.

Then enable the service with:

```bash
sudo systemctl daemon-reload
sudo systemctl enable captain_webhook.service
sudo systemctl start captain_webhook.service
sudo systemctl status captain_webhook.service
```

### 4. Finish

Now you should now be able to reach CaptainWebHook on `{your ip or domain}:1717/`.

## Deployment with CaptainWebHook and Github

### 1. Generate the SSH Key

Since Github wants a unique SSH key for each repo, we need to create a new ssh key on the server first: 

```bash
ssh-keygen -f /root/.ssh/github-wiki.rsa
```

then we edit the `~/.ssh/config` to use the SSH key for a specific repo. 

```bash
nano ~/.ssh/config
```

```ini
Host github-wiki
    # The host that has the remote Git repository
    Hostname github.com
    # Username for remote SSH user (For GitHub, everyone uses the name `git`)
    User git
    # Path to your private SSH key
    IdentityFile /root/.ssh/github-wiki.rsa
```

### 2. Deploy keys

To ensure access to the repo, the public key must be entered as a deploy key in the Github settings. 

### 3. Clone mit Deploy Key

So that the ssh key is used permanently, clone the repo via ssh with our custom host. 

```bash
git clone github-wiki:Medivis/nickiwiki_frontend.git
```

All fetches or pulls from this point on are made with your deploy key and do not need to be authenticated further. 

### 4. Setup a WebHook

After you have access to the repo, you can set up a webhook in CaptainWebHook.
Go to yourserver.com:1717, login and create a hook with the `+`. Here's an example hook on how to build a React app pulls it and then delivers it: 

```bash
cd /www/git/nickiwiki_frontend
git pull
npm install
npm run build
cp -r ./build/* /www/nickiwiki_frontend/
```

### 5. Trigger a Webhook from Github
Under your repo under Webhooks you can add the webhook. Paste the hook into the webhook field, set the type to `application/json` and leave everything else as default. 

### 6. Setup a reverse-proxy

To use the hooks with a normal https port you have to setup a reverse proxy and rout all traffic from `/hooks/` to `localhost:1717/hooks/`. If you dont want to use the default port you can also open port `1717` in your firewall and use this one.