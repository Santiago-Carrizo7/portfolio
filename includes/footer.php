<?php
$dbStatus = (isset($db) && $db !== null) ? 'pgsql:connected' : 'pgsql:ready';
?>
    <footer class="status-bar" role="contentinfo">
        <div class="status-left">
            <span class="status-dot"></span>
            <span class="lang-es">guest@portfolio:~$ <span id="status-clock-es">sesión activa: cargando...</span></span>
            <span class="lang-en">guest@portfolio:~$ <span id="status-clock-en">active session: loading...</span></span>
        </div>
        <div class="status-right">
            <span class="status-item status-db" title="Estado del motor de base de datos"><?= htmlspecialchars($dbStatus) ?></span>
            <span class="status-item">utf-8</span>
            <span class="status-item git-branch">git:main*</span>
            <span class="status-item status-protocol">ssh</span>
        </div>
    </footer>
