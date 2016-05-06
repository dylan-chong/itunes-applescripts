JsOsaDAS1.001.00bplist00�Vscripto, ( f u n c t i o n ( )   { 
 
 	 / /   D o n ' t   l e a v e   a n y   e m p t y   l i n e s   i n   D A T A 
 	 / /   ( o r   s t a r t / e n d   w i t h   \ n ) 
 	 v a r   D A T A _ P R E F I X   =   "   -   " ; 
 	 v a r   D A T A   =   " I .   A l l e g r o \ n "   + 
                 " I I .   L a r g o \ n "   + 
                 " I I I .   A l l e g r o \ n "   + 
                 " I .   V i v a c e \ n "   + 
                 " I I .   L a r g o \ n "   + 
                 " I I I .   A l l e g r o \ n "   + 
                 " I V .   M o d e r a t o \ n "   + 
                 " V .   A l l e g r o \ n "   + 
                 " I .   L a r g o ,   e   s t a c c a t o      a l l e g r o \ n "   + 
                 " I I .   A n d a n t e \ n "   + 
                 " I I I .   A l l e g r o \ n "   + 
                 " I .   L a r g o \ n "   + 
                 " I I .   A n d a n t e \ n "   + 
                 " I I I .   A l l e g r o \ n "   + 
                 " I V .   A l l e g r o \ n "   + 
                 " I .   L a r g o \ n "   + 
                 " I I .   F u g a ,   a l l e g r o \ n "   + 
                 " I I I .   A d a g i o \ n "   + 
                 " I V .   A l l e g r o ,   m a   n o n   t r o p p o \ n "   + 
                 " V .   A l l e g r o \ n "   + 
                 " I .   V i v a c e \ n "   + 
                 " I I .   A l l e g r o " ; 
 	 	 
 	 f u n c t i o n   g e t N e w N a m e ( o l d N a m e )   { 
 	 	 r e t u r n   o l d N a m e   +   D A T A _ P R E F I X   +   d a t a I t e m s [ a ] ; 
 	 } 
 	 
 	 / /   * * * * * * * * * * * * * * * * * * * * * * * * * 
 	 
 	 v a r   a p p   =   A p p l i c a t i o n ( ' i T u n e s ' ) ; 
 	 a p p . i n c l u d e S t a n d a r d A d d i t i o n s   =   t r u e ; 
 	 v a r   w i n d o w   =   a p p . w i n d o w s [ 0 ] ; 
 	 
 	 v a r   s e l e c t i o n   =   w i n d o w . s e l e c t i o n ( ) ; 
 	 
 	 v a r   d a t a I t e m s   =   D A T A . s p l i t ( " \ n " ) ; 
 	 
 	 f o r   ( v a r   a   =   0 ;   a   <   s e l e c t i o n . l e n g t h ;   a + + )   { 
 	 	 i f   ( a   > =   d a t a I t e m s . l e n g t h )   b r e a k ; 
 	 
 	 	 v a r   c u r r e n t T r a c k   =   s e l e c t i o n [ a ] ; 
 	 	 v a r   c u r r e n t T r a c k N a m e   =   c u r r e n t T r a c k . n a m e ( ) ; 
 	 	 v a r   n e w T r a c k N a m e   =   g e t N e w N a m e ( c u r r e n t T r a c k N a m e ) ; 
 	 	 
 	 	 c u r r e n t T r a c k . n a m e . s e t ( n e w T r a c k N a m e ) ; 
 	 	 t h i s . c o n s o l e . l o g ( n e w T r a c k N a m e ) ; 
 	 } 
 	 r e t u r n   " D o n e " ; 
 } ) ( ) ;                              
njscr  ��ޭ